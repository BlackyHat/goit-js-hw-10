import throttle from 'lodash.throttle';
const STORAGE_KEY = 'feedback-form-state';

//беремо посилання на форму
const refs = {
  form: document.querySelector('.feedback-form'),
};

//формуємо пустий обєкт даних для подальшого наповнення з форми
const formData = {};

//додаємо слухача на введення та затримку на фіксацію змін в 500мс
refs.form.addEventListener('input', throttle(onLocalStorageSave, 500));

//додаємо слухача на натиснення кнопки submit
refs.form.addEventListener('submit', onFormSubmit);

//перевірка на помилку JSON
const load = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};
const save = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};

//функція формує обєкт із введених даних у формі згідно назви елементів форми та перетворює в строку і зберігає в localStorage
function onLocalStorageSave(e) {
  formData[e.target.name] = e.target.value;
  save(STORAGE_KEY, formData);
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(formData)); //prevVersion
}

//функція при натисненні на кнопку submit: відключаємо подію перезавантаження сторінки, очищуємо поля поточної форми, формуємо обєкт із даних в localStorage, очщаємо localStorage по ключу STORAGE_KEY та виводимо обєкт в консоль
function onFormSubmit(e) {
  e.preventDefault();
  e.currentTarget.reset();
  const userData = load(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  return console.log(userData);
}

//перевіряємо чи є дані від попереднього введення у форму та якщо є - прописуємо збережені дані у форму, виклик функції в місці оголошення
(function getStorageKey() {
  if (localStorage.getItem(STORAGE_KEY)) {
    const userData = load(STORAGE_KEY);

    refs.form.message.value = userData.message;
    refs.form.email.value = userData.email;
  }
})();
