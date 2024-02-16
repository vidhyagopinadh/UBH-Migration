export interface BaseModalProps {
    open : boolean,
    onClose :(e?:any,r?:any) => void;
    title : string,
    confirmAction :(r:boolean) => void;
    content : string,
    subContent ?: [],
    successButtonName: string,
    timeRemaining ?:any,
    lastReminderSendAt ?:any,
    type ?:string,
    closeButtonName:string,
    feedbackFailedUploads ?:[],
    feedbackFailedSubTitle ?:string,
}

