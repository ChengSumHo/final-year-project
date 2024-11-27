const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Serve main page of HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main_page.html'));
});

// Serve signup form
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_up.html'));
});

// Serve login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'log_in.html'));
});

// Supabase URL and anon key
const supabaseUrl = 'https://cgyqozdsmzorxtacvkvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneXFvemRzbXpvcnh0YWN2a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1Njg0NDAsImV4cCI6MjA0MjE0NDQ0MH0.42U9Gd8uz9YgWW2rXWt8WI9VSZSH9asWRlY3NE5Zk24';
const supabase = createClient(supabaseUrl, supabaseKey);

// Route to create a new user
app.post('/users', async (req, res) => {
    const { password, email, name } = req.body;

    // Optionally hash the password before storing it
    // const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert([{ password, email, name }])
        .select();

    if (error) {
        console.error('Error creating user:', error);
        return res.status(400).send('Error creating user: ' + error.message);
    }

    if (password.length >= 10) {
        return res.status(400).send('Password is too long.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    res.status(201).send('User created successfully!');
});

// Route to get a user by ID
app.get('/users/:id', async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error || !data) {
        console.error('Error logging in or user not found:', error);
        return res.status(401).send('Invalid User ID or password.');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid User ID or password.');
    }

    res.status(200).send('Login successful!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});