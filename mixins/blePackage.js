
// 任务队列
let taskQueue = [];
let isProcessing = false;
// 这里还可能包含其他需要导出的变量或函数，例如：
export const blockSize = 48;         // 示例值
export const internalInner = 20;      // 示例值
export const internalOutter = 150;     // 示例值
function ab2hex(buffer) {
			const hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}
			)
			return hexArr.join('')
		}
/**
 * 将 buffer 分块，每一个块调用 bufferProcesser 进行处理，如果都处理成功，调用 onSuccesss。
 * @param {ArrayBuffer} buffer 
 * @param {(buffer: ArrayBuffer, ok: () => void) => void} bufferProcesser 如何处理每一个包，如果成功，需要调用 ok 方法。
 * @param {(success: boolean) => void} onSuccesss 处理完所有包后的回调
 * @return {Promise<void>}
 */
async function processBufferInChunks(buffer, bufferProcesser, onSuccesss) {
  return new Promise((resolve) => {
    let chunks = [];

    // 将 buffer 分块
    for (let i = 0; i < buffer.byteLength; i += blockSize) {
      const chunk = buffer.slice(i, i + blockSize);
      chunks.push(chunk);
    }
    let successCount = 0;

    // 递归处理每一个块
    function processChunks(index = 0) {
      if (index < chunks.length) {
        const chunk = chunks[index];
        console.log(`发送包， index = ${index}, 内容：${ab2hex(chunk)}`);
        bufferProcesser(chunk, () => {
          successCount++;
        });
        setTimeout(() => processChunks(index + 1), internalInner);
      } else {
        // console.log(`发送了${successCount}/${chunks.length}个包`);
        onSuccesss(successCount === chunks.length);
        setTimeout(() => resolve(), internalOutter); // 所有块发送完毕，延迟 internalOutter 毫秒后完成任务
      }
    }

    // 开始发送第一个块
    processChunks(0);
  });
}

/**
 * 处理任务队列，确保每个任务按顺序执行
 * @return {Promise<void>}
 */
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (taskQueue.length > 0) {
    const task = taskQueue.shift(); // 获取下一个任务
    if (task) await task();
  }

  isProcessing = false;
}

/**
 * 将任务加入队列并启动处理队列
 * @param {ArrayBuffer} buffer 
 * @param {(buffer: ArrayBuffer, ok: () => void) => void} bufferProcesser
 * @param {(success: boolean) => void} onSuccesss
 */
export function enqueueTask(buffer, bufferProcesser, onSuccesss) {
  taskQueue.push(() => processBufferInChunks(buffer, bufferProcesser, onSuccesss));
  processQueue();
}

/**
 * 定义一个函数 bufferedProcess(message: ArrayBuffer)，在短时间内多次调用时将字符串 message 记录并拼接起来。
 * 如果在指定时间间隔（例如 500 毫秒）内没有新调用 bufferedProcess，则使用 process 处理拼接的字符串。
 * @param {number} delay 延时时间
 * @param {(msg: ArrayBuffer) => void} process 如何处理拼接好的字符串
 * @returns {(message: ArrayBuffer) => void} 一个可以调用的函数 bufferedProcess
 */
export function createBufferedProcess(delay, process) {
  if (delay === 0) {
    return process;
  }
  
  let stringBuffer = new ArrayBuffer(0); // 保存累积的字符串
  let timer = null; // 保存计时器

  /**
   * bufferedProcess 函数用于接收和处理字符串
   * @param {ArrayBuffer} message 要处理的字符串
   */
  function bufferedProcess(message) {
    // 追加新的字符串到缓冲区
    stringBuffer = concatenateArrayBuffers([stringBuffer, message]);

    // 清除上一个计时器（如果有）
    if (timer !== null) {
      clearTimeout(timer);
    }

    // 设置一个新的计时器
    timer = setTimeout(() => {
      // 处理拼接后的字符串，并清空缓冲区
      process(stringBuffer);
      stringBuffer = new ArrayBuffer(0);
    }, delay);
  }

  return bufferedProcess;
}

