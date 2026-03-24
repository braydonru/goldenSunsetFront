export const dimentioner = (order) => {

    const DEFAULT_PARCEL = {
        length: 0,
        width: 0,
        height: 0,
    };

    if (order.type === 'Pullover' && (order.qantity >= 1 && order.qantity < 6)) {
        DEFAULT_PARCEL.length = 12;
        DEFAULT_PARCEL.width = 5;
        DEFAULT_PARCEL.height = 1;
    } else if (order.type === 'Pullover' && (order.qantity >= 6 && order.qantity < 10)) {
        DEFAULT_PARCEL.length = 12;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 6;
    } else if (order.type === 'Pullover' && (order.qantity >= 11 && order.qantity <= 20)) {
        DEFAULT_PARCEL.length = 13;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 11;
    } else if (order.type === 'Pullover' && order.qantity > 20) {
        DEFAULT_PARCEL.length = 16;
        DEFAULT_PARCEL.width = 16;
        DEFAULT_PARCEL.height = 16;
    }

    if (order.type === 'Thermo' && order.qantity <= 5) {
        DEFAULT_PARCEL.length = 8;
        DEFAULT_PARCEL.width = 8;
        DEFAULT_PARCEL.height = 8;
    } else if (order.type === 'Thermo' && (order.qantity >= 5 && order.qantity <= 12)) {
        DEFAULT_PARCEL.length = 13;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 11;
    } else if (order.type === 'Thermo' && order.qantity > 12) {
        DEFAULT_PARCEL.length = 16;
        DEFAULT_PARCEL.width = 16;
        DEFAULT_PARCEL.height = 16;
    }
    if (order.type === 'Mug' && order.qantity <= 6) {
        DEFAULT_PARCEL.length = 8;
        DEFAULT_PARCEL.width = 8;
        DEFAULT_PARCEL.height = 8;
    } else if (order.type === 'Mug' && (order.qantity > 6 && order.qantity <= 12)) {
        DEFAULT_PARCEL.length = 13;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 11;
    } else if (order.type === 'Mug' && order.qantity > 12) {
        DEFAULT_PARCEL.length = 16;
        DEFAULT_PARCEL.width = 16;
        DEFAULT_PARCEL.height = 16;
    }
    if (order.type === 'Cap' && order.qantity <= 5) {
        DEFAULT_PARCEL.length = 8;
        DEFAULT_PARCEL.width = 8;
        DEFAULT_PARCEL.height = 8;
    } else if (order.type === 'Cap' && (order.qantity > 5 && order.qantity <= 15)) {
        DEFAULT_PARCEL.length = 12;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 6;
    } else if (order.type === 'Cap' && order.qantity > 15) {
        DEFAULT_PARCEL.length = 13;
        DEFAULT_PARCEL.width = 9;
        DEFAULT_PARCEL.height = 11;
    }
    if (order.type === 'Plate') {
        DEFAULT_PARCEL.length = 12;
        DEFAULT_PARCEL.width = 5;
        DEFAULT_PARCEL.height = 1;
    }
    return DEFAULT_PARCEL
}