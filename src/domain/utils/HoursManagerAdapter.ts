import {type HoursManager} from '../protocols/HoursManager';

export class HoursManagerAdapter implements HoursManager {
	diffBetweenHours(time1: string, time2: string): string {
		const [time1Object, time2Object] = [this.parseHourToObject(time1), this.parseHourToObject(time2)];
		const time1InSeconds = (time1Object.hours * 60 * 60) + (time1Object.minutes * 60) + time1Object.seconds;
		const time2InSeconds = (time2Object.hours * 60 * 60) + (time2Object.minutes * 60) + time2Object.seconds;

		let diff = Math.abs(time1InSeconds - time2InSeconds);
		const seconds = diff % 60;
		diff = Math.floor(diff / 60);
		const minutes = diff % 60;
		diff = Math.floor(diff / 60);
		const hours = diff;

		return `${
			hours.toString().padStart(2, '0')
		}:${
			minutes.toString().padStart(2, '0')
		}:${
			seconds.toString().padStart(2, '0')
		}`;
	}

	sumHours(time1: string, time2: string): string {
		const t1 = this.parseHourToObject(time1);
		const t2 = this.parseHourToObject(time2);

		let seconds = t1.seconds + t2.seconds;
		let minutes = t1.minutes + t2.minutes + Math.floor(seconds / 60);
		const hours = t1.hours + t2.hours + Math.floor(minutes / 60);

		seconds %= 60;
		minutes %= 60;

		return `${
			hours.toString().padStart(2, '0')
		}:${
			minutes.toString().padStart(2, '0')
		}:${
			seconds.toString().padStart(2, '0')
		}`;
	}

	private parseHourToObject(time: string): Record<string, number> {
		const [hours, minutes, seconds] = time.split(':');
		return {hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds)};
	}
}
