export function formatVND(amount) {
    if (!amount) return "0 VND";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
}
