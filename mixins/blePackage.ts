


// 任务队列
let taskQueue : (() => Promise<void>)[] = [];
let isProcessing = false;
 const blockSize = 20;         // 示例值
 const internalInner = 20;      // 示例值
 const internalOutter = 150;     // 示例值

/**
 * 将buffer分块，每一个块调用bufferProcesser进行处理，如果都处理成功，调用onSuccess。
 * @param {ArrayBuffer} msg 
 * @param {(buffer: ArrayBuffer, ok:()=>void) => void} bufferProcesser 如何处理每一个包，如果成功，需要调用ok方法。
 * @return 
 */
async function processBufferInChunks(
	buffer : ArrayBuffer,
	bufferProcesser : (buffer : ArrayBuffer, ok : () => void) => void,
	onSuccesss : (success:boolean) => void
) : Promise<void> {
	
	return new Promise((resolve) => {
		let chunks : ArrayBuffer[] = [];

		// 将 buffer 分块
		for (let i = 0; i < buffer.byteLength; i += blockSize) {
			const chunk = buffer.slice(i, i + blockSize);
			chunks.push(chunk);
		}
		let successCount = 0

		// 递归处理每一个块
		function processChunks(index : number = 0) : void {
			
			if (index < chunks.length) {
				const chunk = chunks[index];
				console.log(`发送包， index = ${index}, 内容：`)
				bufferProcesser(chunk, () => {
					successCount++
				});
				setTimeout(() => processChunks(index + 1), internalInner);
			} else {
				console.log(`发送了${successCount}/${chunks.length}个包`)
				onSuccesss(successCount === chunks.length)
				setTimeout(() => resolve(), internalOutter); // 所有块发送完毕，延迟 internalOutter 毫秒后完成任务
			}
		}

		// 开始发送第一个块
		processChunks(0);
	});
}

/**
 * 处理任务队列，确保每个任务按顺序执行
 */
async function processQueue() : Promise<void> {
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
 * @param task 一个返回 Promise 的函数，表示要执行的任务
 */
export function enqueueTask(
	buffer : ArrayBuffer,
	bufferProcesser : (buffer : ArrayBuffer, ok : () => void) => void,
	onSuccesss : (success:boolean) => void
) : void {
	taskQueue.push(() => processBufferInChunks(buffer, bufferProcesser, onSuccesss));
	processQueue();
}


/**
 * 定义一个函数 bufferedProcess(message: string)，在短时间内多次调用时将字符串 message 记录并拼接起来。
 * 如果在指定时间间隔（例如 500 毫秒）内没有新调用 bufferedProcess，则使用process处理拼接的字符串。
 * @param process 如何处理拼接好的字符串
 * @returns 一个可以调用的函数 bufferedProcess
 */
// export function createBufferedProcess(delay:number, process : (msg : ArrayBuffer) => void) {
// 	if(delay==0){
// 		return process
// 	}
	
// 	let stringBuffer : ArrayBuffer = new ArrayBuffer(0); // 保存累积的字符串
// 	let timer : NodeJS.Timeout | null = null; // 保存计时器

// 	/**
// 	 * bufferedProcess 函数用于接收和处理字符串
// 	 * @param message 要处理的字符串
// 	 */
// 	function bufferedProcess(message : ArrayBuffer) : void {
// 		// 追加新的字符串到缓冲区
// 		stringBuffer = concatenateArrayBuffers([stringBuffer, message])

// 		// 清除上一个计时器（如果有）
// 		if (timer !== null) {
// 			clearTimeout(timer);
// 		}

// 		// 设置一个新的计时器
// 		timer = setTimeout(() => {
// 			// 打印并清空缓冲区
// 			process(stringBuffer);
// 			stringBuffer = new ArrayBuffer(0);
// 		}, delay);
// 	}

// 	return bufferedProcess;
// }