const express = require('express');
const cors = require('cors'); // Only import cors once
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();


app.use(bodyParser.json());
app.use(cors()); 

// CREA UN DOTENV Y PIDEME UN USUARIO Y LINK DE MONGODB
mongoose.connect(process.env.MONGODB_URI);

// Modelos base de datos
const User = require('./models/User.js'); 
const Game = require('./models/Game')

// REGISTRO
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = new User({ username, password: hashedPassword })
  
  try {
    await newUser.save();
    res.status(200).json({ message: 'Enhorabuena' });

  } catch (error) {
    res.status(500).json({ message: 'Algo fue mal' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  const username = await User.findOne({ username: user }); //ES ASI PQ EN EL MODELO ES USERNAME
  console.log("Esto es el usuario q encuentra el login: ",username)
  if (username && bcrypt.compareSync(password, username.password)) {
    res.status(200).json({ message: 'PA DENTRO', user });// 200-> OK MIRAR HTTP CATS PARA INFO
  } else {
    res.status(401).json({ message: 'ERROR' });
  }
});



// JUEGOS
app.post('/resultsOfGame', async (req, res) => {
  const { result, userId } = req.body; // recogemos los datos

  try {
    
    console.log("result: " , result);
    console.log("userId:", typeof(userId));
    const userName = await User.findOne({ username: userId }); //UPDATEAMOS EL USUARIO
    console.log("Este es el usuario que encuentra el juego para actualizar info", userName)
    userName.total_games += 1;
    userName.wins += result;
    
    userName.winPercentage = (userName.wins / userName.total_games) * 100;

    await userName.save();

    res.status(200).json({ message: 'OK ', userName });
  } catch (error) {
    res.status(500).json({ message: 'ERROR' });
  }
});

// GET USER
app.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find();
    arrayOrdenado= users.sort((a, b) => b.winPercentage - a.winPercentage)
    res.send(arrayOrdenado);
  } catch (error) {
    res.status(500).json({ message: 'ERROR' });
  }
});

// GET USER BY ID
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const userName = await User.findOne({ username: userId });
  if (userName) {
    res.send(userName);
    //res.send(userName,total_games,winPercentage,wins);
    
    //res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
