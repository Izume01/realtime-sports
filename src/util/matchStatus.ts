import { matchStatus } from "../validation/zod.schema.ts";

export const getMatchStatus = (startTime : string , endTime : string , currentTime = new Date()) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return matchStatus.pending;

    if (currentTime < start) return matchStatus.pending;
    if (currentTime > end) return matchStatus.completed;
    return matchStatus.inProgress;
}

export const syncMatchStatus = async (match, updateStatus) => {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);

    if (!nextStatus) {
        return match.status;
    }

    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }

    return match.status;
}