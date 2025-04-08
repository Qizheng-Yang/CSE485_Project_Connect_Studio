export const getAudioDuration = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        audioContext.decodeAudioData(arrayBuffer)
          .then((audioBuffer) => {
            const duration = audioBuffer.duration;
            resolve(secondsToTimeString(duration));
          })
          .catch((error) => {
            reject(error);
          });
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  };
  
  const secondsToTimeString = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };