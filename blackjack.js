// Initialize game variables
let dealerSum = 0; // Sum of dealer's cards
let yourSum = 0; // Sum of player's cards

let dealerAceCount = 0; // Count of dealer's aces
let yourAceCount = 0; // Count of player's aces

let hidden; // Hidden card for dealer
let deck; // Deck of cards

let canHit = true; // Allows player to draw cards if their sum <= 21

// Sound elements
const loseSound = new Audio('assets_sounds_sfx_lose.ogg'); // Sound for losing
const shieldUpSound = new Audio('assets_sounds_sfx_shieldUp.ogg'); // Sound for winning

// Initialize game on window load
window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

// Build a new deck of cards
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"]; // C = Clubs, D = Diamonds, H = Hearts, S = Spades
    deck = [];

    // Create each card by combining values and types
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // Example: A-C, K-D
        }
    }
}

// Shuffle the deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        // Swap each card with another random card
        let j = Math.floor(Math.random() * deck.length); // Random index
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck); // Print shuffled deck to console for debugging
}

// Start the game
function startGame() {
    // Dealer's initial hidden card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // Dealer draws cards until their sum is at least 17
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg); // Add card image to dealer's cards
    }

    // Player draws two cards initially
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg); // Add card image to player's cards
    }

    // Set up event listeners for buttons
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

// Function to handle "Hit" button - player draws an additional card
function hit() {
    if (!canHit) return; // Stop drawing if player can't hit

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg); // Add card image to player's cards

    // If the sum exceeds 21, player cannot hit anymore
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

// Function to handle "Stay" button - player decides to stop drawing cards
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount); // Adjust dealer sum for aces
    yourSum = reduceAce(yourSum, yourAceCount); // Adjust player sum for aces

    canHit = false; // Stop the player from drawing more cards
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; // Reveal dealer's hidden card

    // Determine the result of the game
    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        loseSound.play(); // Play lose sound
    }
    else if (dealerSum > 21) {
        message = "You Win!";
        shieldUpSound.play(); // Play win sound
    }
    // If both sums are <= 21, compare their values
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        shieldUpSound.play(); // Play win sound
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        loseSound.play(); // Play lose sound
    }

    // Update the display with results
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

// Get the value of a card (e.g., 4, J, A)
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    // Return the appropriate value based on card type
    if (isNaN(value)) { // A J Q K
        if (value == "A") {
            return 11; // Ace initially counts as 11
        }
        return 10; // Face cards count as 10
    }
    return parseInt(value); // Number cards return their face value
}

// Check if a card is an Ace
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// Adjust for Aces if sum is greater than 21
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10; // Count Ace as 1 instead of 11
        playerAceCount -= 1;
    }
    return playerSum;
}