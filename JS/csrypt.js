
const container = document.querySelector('.container')
const menu = document.querySelector('.menu-game');
const timeBlock = createTimeBlock();
let size1;    //размер поля 1
let size2;    //размер поля 2
// const board = document.querySelector('.board-game');  // обьект поле
let arrActive = [];       // массив активных элементов
let store = 0;      // количество угаданных карточек
let time;
let win = false;

menuGame();
function menuGame(){
  const inputSize1 = document.querySelector('#size-1');
  const inputSize2 = document.querySelector('#size-2');
  const btnStart = document.querySelector('.start-game');
  const timeRadio = document.querySelectorAll('.radio');  // радио кнопка сложности
    

  

  btnStart.addEventListener('click', ()=> {      // нажатие кнопки старт
    if(inputSize1.value && inputSize2.value){   // проверка есть ли размеры поля для игры
      win = false;  
      store = 0;
      menu.style.opacity = '0';
      menu.style.display = 'none';
      size1 = inputSize1.value;
      size2 = inputSize2.value;

      // выставляем время для таймера в зависимости от выбранной сложности
      timeRadio.forEach(el => {
        if(el.checked){
          time = Math.floor((5*size1*size2) / el.getAttribute('data-time'));
        }
      })


      createTimeBlock();
       wathTime();      // создаем таймер обратного очета
      createGame(randomArray(createArr(inputSize1.value, inputSize2.value)));  // создаем все карточки
      setTimeout(()=> {
        board.style.opacity = '1';   // делаем поле для игры видимым
        timer();
      },0)

    }
  })
}


// получение всех карточек
const allBlock = document.querySelectorAll('.block');

// слушатель на все карточки
allBlock.forEach(item => item.addEventListener('click', (event) => play(event.target)));

// функция создания всех карточек игры на основе массива с рандомными числами
function createGame(arr) {
  if(container.children.namedItem('board')){
    container.children.namedItem('board').remove();
   console.log('createGame'); 
  }
  
  const board = document.createElement('ul');
  board.className = 'board-game';
  board.id = 'board'
  window.board = board;
  container.append(board);
  
  for (let i = 0; i < arr.length; i++) {
    createItem(board, arr[i]);
  }
  return board;
}
// функция создания карточек. 
// принимает параметры (родительский элемент, значение из массива рандомных чисел)
function createItem(parent, value) {
  let gameItem = document.createElement('li');
  let block = document.createElement('div');
  let cardGame = document.createElement('div');
  let cardGameBack = document.createElement('div');

  gameItem.classList.add('game-item');
  block.classList.add('block')
  cardGame.classList.add('card-game');
  cardGameBack.classList.add('card-game-back');
  block.setAttribute("dataValue", `${value}`);
  gameItem.style.flex = `0 0 calc(100% / ${size1} - 1rem)`
  parent.append(gameItem);
  gameItem.append(block);
  block.append(cardGame);
  block.append(cardGameBack);
  cardGameBack.textContent = value;

  block.addEventListener('click', (event) => play(event.target));
}

// функция создания массива чесел (размер поля х*х) возврачает массив с числами попарно
function createArr(size1, size2) {
  let arr = [];
  for (let i = 0; i < Math.floor(size1 * size2 / 2); i++) {
    arr.push(i + 1);
    arr.push(i + 1);
  }
  return arr;
}

// функция перемешивания значений в массиве 
function randomArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (1 + i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// функция преворота карточки и проверки на соответствие ( element нажатой карточки )
function play(element) {
  switch (arrActive.length) {
    
    case 0:
      addClass(element);
      arrActive.push(element.parentNode)
      break;
    case 1:
      if (!hasClass_Active(element.parentNode)) {
        addClass(element);
        arrActive.push(element.parentNode)
      }
      break;
  }

  if (arrActive.length == 2) {
    setTimeout(() => {
      if (logicGame(arrActive)) {
        store += 2;
        addClassWin(arrActive);
      }
      removeClassActive()
      if(store == size1*size2){
        gameOver("Вы выиграли");
        win = true;
      }
    }, 400)
  }
}

// добавление класса 'active'
function addClass(elem) {
  elem.parentNode.classList.add('active');
}

// удаление класса 'active' у элементов в массиве активных
function removeClassActive() {
  arrActive.forEach(item => item.classList.remove('active'));
  arrActive = [];
}


// скрытие угаданных карточек
function addClassWin(arr) {
  arr.forEach(item => {
    item.style.visibility = 'hidden';
  });
}


// проверка есть ли класс 'active' у элемента ( элемент )
function hasClass_Active(el) {
  return el.classList.contains('active');
}


// проверка совпали ли карточки
function logicGame(arr) {
  return (arr[1] && arr[0] && arr[0].getAttribute('dataValue') == arr[1].getAttribute('dataValue'));
}


// таймер обратного отчета до проигрыша
function timer(){
  let timeOut = setTimeout(()=> timer(),1000);
  if(win){ 
    clearTimeout(timeOut);
    return;
  }
  if(time < 1){
    clearTimeout(timeOut);
    gameOver("Время вышло")
    return;
  }
  time--;
  if(time < 15){
    timeBlock.style.color = 'red';
   }
  timeBlock.innerHTML = time;
}

// функция создания таймера
function createTimeBlock(){
  let timeBlock = document.createElement('span');
  timeBlock.style.position = 'fixed';
  timeBlock.style.left = '2rem';
  timeBlock.style.top = '2rem';
  timeBlock.style.fontSize = '4rem';
  timeBlock.style.color = 'green';
  return timeBlock;
}

// функция показа таймера
function wathTime(){
  
  container.append(timeBlock);
 
}

// функция завершения игры
function gameOver(text){
  board.style.opacity = '0';
  board.remove();
  container.removeChild(timeBlock);
  menu.style.opacity = '1';
  menu.style.display = 'flex'
  arrActive = [];
  alert(`${text} Ваш счет ${store}`)
  
}