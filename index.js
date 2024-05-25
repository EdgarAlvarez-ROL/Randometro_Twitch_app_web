import tmi from 'tmi.js';

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['roldyoran']
});

let numbersArray = [];
let distanceToMove = 4;
let bandera = false; // Variable de control para verificar si se ha iniciado el proceso

let intervalId; // Variable para almacenar el ID del intervalo de tiempo
let currentTransformX = 0; // Variable para almacenar la posición actual en X del chatElement

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    let number;

    switch (message) {
        case "7":
            number = 7;
            break;
        case "6":
            number = 6;
            break;
        case "5":
            number = 5;
            break;
        case "4":
            number = 4;
            break;
        case "3":
            number = 3;
            break;
        case "2":
            number = 2;
            break;
        case "1":
            number = 1;
            break;
        default:
            number = null;
    }

    if (!isNaN(number) && number >= 1 && number <= 8) {
        numbersArray.push(number);
    }
});

function calcularPromedio() {
    intervalId = setInterval(() => {
        if (numbersArray.length > 0) {
            const sum = numbersArray.reduce((acc, curr) => acc + curr, 0);
            const promedio = parseInt(sum / numbersArray.length);
            console.log("Promedio:", promedio);

            const chatElement = document.getElementById('twitch');
            const destinationElement = document.getElementById(promedio.toString());
            const destinationX = destinationElement.getBoundingClientRect().left;
            const chatX = chatElement.getBoundingClientRect().left;
            
            distanceToMove = destinationX - chatX;

            currentTransformX += distanceToMove; // Acumula la distancia a mover

            chatElement.style.transition = 'transform 1s ease';
            chatElement.style.transform = `translateX(${currentTransformX}px)`;

            // Superponer el elemento del chat por encima de los demás elementos
            chatElement.style.position = 'fixed';
            chatElement.style.zIndex = '9999'; // Asegura que el chat esté por encima de otros elementos
        } else {
            console.log("No se han enviado números del 1 al 8.");
        }
    }, 4000);
}

const startButton = document.getElementById('start');

startButton.addEventListener('click', () => {
    if (!bandera) { // Si la bandera es falsa, inicia el proceso
        calcularPromedio();
        bandera = true;
    } else { // Si la bandera es verdadera, detiene el proceso
        clearInterval(intervalId); // Detiene la ejecución del intervalo
        bandera = false; // Restablece la bandera a falsa para permitir que se inicie nuevamente
    }
});
