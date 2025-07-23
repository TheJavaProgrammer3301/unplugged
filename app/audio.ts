

// Shared audio context and current playing state
let currentAudioContext: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentAudio: HTMLAudioElement | null = null;
let currentSoundName: string | null = null;

export function playSound(soundName: string) {
	// if (soundName === currentSoundName && currentAudio?.paused === false) return;

	currentSoundName = soundName;
	currentAudio?.pause();

	// Stop any currently playing sound
	if (currentOscillator) {
		try {
			currentOscillator.stop();
		} catch (e) {
			// Oscillator might already be stopped
		}
		currentOscillator = null;
	}

	// Try to play audio file first
	let audioFileName: string = soundName;
	if (soundName === 'happy') {
		// 1/1000 chance to play "sayonara.mp3" instead of "happy.mp3"
		if (Math.random() < 0.001) {
			audioFileName = 'sayonara';
		}
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}
	}
	currentAudio = new Audio(`/${audioFileName}.mp3`);

	if (soundName === "background" && currentAudio) currentAudio.loop = true;
	
	currentAudio.play().catch(() => {
		// Fallback: create different sounds based on command
		try {
			if (!currentAudioContext) {
				currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			}

			const oscillator = currentAudioContext.createOscillator();
			const gainNode = currentAudioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(currentAudioContext.destination);

			// Different frequencies for different sounds
			const frequency = 600;
			oscillator.frequency.setValueAtTime(frequency, currentAudioContext.currentTime);
			gainNode.gain.setValueAtTime(0.1, currentAudioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, currentAudioContext.currentTime + 0.3);

			oscillator.start(currentAudioContext.currentTime);
			oscillator.stop(currentAudioContext.currentTime + 0.3);

			currentOscillator = oscillator;

			// Clear reference when sound ends
			oscillator.onended = () => {
				currentOscillator = null;
			};
		} catch (error) {
			console.warn(`Could not play ${soundName} sound:`, error);
		}
	});
};