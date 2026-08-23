import { DebugInfo } from './types';

export interface StreamResult {
  text: string;
  debugInfo?: DebugInfo;
}

/**
 * Streams text with a natural, human-like cadence and rhythm.
 * Provides distinct micro-pauses for punctuation:
 * - Periods (.), exclamation marks (!), question marks (?): ~190ms
 * - Commas (,), colons (:), semicolons (;): ~100ms
 * - Paragraph / line breaks (\n): ~130ms
 * - Standard characters: ~14ms
 * Dynamically adjusts speed if network buffer grows large.
 * Automatically separates and parses debug payload without displaying it.
 */
export async function streamWithPunctuationRhythm(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  signal: AbortSignal,
  onUpdate: (currentText: string) => void
): Promise<StreamResult> {
  const decoder = new TextDecoder();
  let fullIncoming = '';
  let cleanVisibleText = '';
  let extractedDebugInfo: DebugInfo | undefined = undefined;
  let displayedIndex = 0;
  let isStreamDone = false;

  const extractDebugIfPresent = (rawText: string) => {
    const startTag = '<!--__DEBUG_DATA_START__';
    const endTag = '__DEBUG_DATA_END__-->';
    const startIndex = rawText.indexOf(startTag);

    if (startIndex !== -1) {
      const visiblePart = rawText.slice(0, startIndex);
      const endIndex = rawText.indexOf(endTag, startIndex);

      if (endIndex !== -1 && !extractedDebugInfo) {
        const encodedData = rawText.slice(startIndex + startTag.length, endIndex);
        try {
          extractedDebugInfo = JSON.parse(decodeURIComponent(encodedData));
        } catch (e) {
          console.error('Failed to parse debug payload:', e);
        }
      }
      return visiblePart;
    }
    return rawText;
  };

  // Background pump: reads network stream chunks as fast as they arrive
  const pumpReader = async () => {
    try {
      while (true) {
        if (signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) {
          isStreamDone = true;
          break;
        }
        fullIncoming += decoder.decode(value, { stream: true });
        cleanVisibleText = extractDebugIfPresent(fullIncoming);
      }
    } catch {
      isStreamDone = true;
    }
  };

  const pumpPromise = pumpReader();

  // Smooth typewriter loop
  while (!signal.aborted) {
    cleanVisibleText = extractDebugIfPresent(fullIncoming);

    if (displayedIndex < cleanVisibleText.length) {
      const remaining = cleanVisibleText.length - displayedIndex;

      // If a very large chunk arrives, slightly increase step so it stays responsive
      const step = remaining > 350 ? 4 : remaining > 180 ? 2 : 1;
      displayedIndex = Math.min(displayedIndex + step, cleanVisibleText.length);
      const currentDisplayed = cleanVisibleText.slice(0, displayedIndex);

      onUpdate(currentDisplayed);

      const lastChar = cleanVisibleText[displayedIndex - 1];

      // Calculate punctuation-aware delay
      let delay = 14; // Default standard letter speed

      if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
        // Full stop / sentence ending pause
        delay = 190;
      } else if (lastChar === ',' || lastChar === ';' || lastChar === ':') {
        // Comma / clause breath pause
        delay = 100;
      } else if (lastChar === '\n') {
        // Linebreak pause
        delay = 130;
      } else if (lastChar === ' ') {
        delay = 20;
      }

      // If buffer is lagging behind significantly, compress delay gracefully
      if (remaining > 250) {
        delay = Math.max(delay * 0.35, 5);
      } else if (remaining > 120) {
        delay = Math.max(delay * 0.65, 8);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    } else if (isStreamDone) {
      // Completed network stream and all characters rendered
      cleanVisibleText = extractDebugIfPresent(fullIncoming);
      if (displayedIndex < cleanVisibleText.length) {
        displayedIndex = cleanVisibleText.length;
        onUpdate(cleanVisibleText);
      }
      break;
    } else {
      // Waiting for new incoming chunk from network
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }

  await pumpPromise;
  cleanVisibleText = extractDebugIfPresent(fullIncoming);

  return {
    text: cleanVisibleText,
    debugInfo: extractedDebugInfo,
  };
}
