import { Request, Response } from 'express';
import { chatService } from './chat.service.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { ChatRequest } from './chat.schema.js';

export const chatController = {
  /**
   * Handles chat requests with Server-Sent Events (SSE) streaming.
   * Pipes tokens to the client as they arrive from the LLM provider.
   */
  async chat(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!user?.sub) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const { messages } = req.body as ChatRequest;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Prevent Nginx/proxy buffering

    // Flush headers immediately so client receives them
    res.flushHeaders();

    let streamClosed = false;

    // Handle client disconnect
    req.on('close', () => {
      streamClosed = true;
      logger.debug('[chat] Client disconnected');
    });

    try {
      const stream = await chatService.streamChatResponse(messages, {
        name: user.email as string | undefined,
      });

      // Pipe streaming chunks to client
      for await (const chunk of stream) {
        if (streamClosed) break;

        const content =
          (chunk as { choices?: Array<{ delta?: { content?: string } }> }).choices?.[0]?.delta
            ?.content ?? '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Signal completion
      if (!streamClosed) {
        res.write('data: [DONE]\n\n');
      }
    } catch (err) {
      logger.error({ err }, '[chat] Stream error');
      if (!streamClosed) {
        res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`);
      }
    } finally {
      if (!streamClosed) {
        res.end();
      }
    }
  },
};
