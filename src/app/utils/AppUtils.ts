
export class AppUtils {
    
    static capitalizeFirstLatter(s: string): string {
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
    }

}