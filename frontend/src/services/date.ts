import { format, addHours, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, subDays, parseISO } from 'date-fns';


export const get_current_date = () => {
    return addHours(new Date(), 9).toISOString().split("T")[0]
} 

export const date_to_unified_format = (date:Date) => {
    return addHours(date, 9).toISOString().split("T")[0]
}