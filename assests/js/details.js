document.addEventListener('DOMContentLoaded', function() {
    const detailDateElement = document.getElementById('detailDate');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const restHoursInput = document.getElementById('restHours');
    const saveButton = document.getElementById('save');
    const backButton = document.getElementById('back');

    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');

    if (date) {
        const [year, month, day] = date.split('-');
        detailDateElement.textContent = `${year}年${month}月${day}日の詳細`;
    } else {
        detailDateElement.textContent = '日付が選択されていません';
        return;
    }

    // localStorageからデータを読み込む
    let workData = JSON.parse(localStorage.getItem('workHours')) || {};
    const dayData = workData[date];

    if (dayData) {
        checkInInput.value = dayData.checkIn || '';
        checkOutInput.value = dayData.checkOut || '';
        restHoursInput.value = dayData.restHours || '';
    }

    saveButton.addEventListener('click', () => {
        workData[date] = {
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            restHours: restHoursInput.value
        };
        localStorage.setItem('workHours', JSON.stringify(workData));
        alert('保存しました！');
        window.location.href = 'index.html';
    });

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});