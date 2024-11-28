const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like HTML) from the 'public' directory
app.use(express.static('public'));

// Supabase URL and anon key
const supabaseUrl = 'https://cgyqozdsmzorxtacvkvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneXFvemRzbXpvcnh0YWN2a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1Njg0NDAsImV4cCI6MjA0MjE0NDQ0MH0.42U9Gd8uz9YgWW2rXWt8WI9VSZSH9asWRlY3NE5Zk24';
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Route to create a new user (unchanged)
app.post('/users', async (req, res) => {
    const { password, email, name } = req.body;

    const { data, error } = await supabase
        .from('users')
        .insert([{ password, email, name }])
        .select();

    if (error) {
        console.error('Error creating user:', error);
        return res.status(400).send('Error creating user: ' + error.message);
    }

    res.status(201).send('User created successfully!');
});

// Updated Route to handle user login
app.post('/login', async (req, res) => {
    const { user_id, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('password')
        .eq('user_id', user_id)
        .maybeSingle(); // Use maybeSingle to handle zero results

    if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).send('An error occurred.');
    }

    if (!data) {
        // No user found with that email
        return res.status(400).send('Invalid User ID or Password.');
    }

    if (data.password === password) {
        // Login successful
        res.status(200).send('Login successful!');
    } else {
        // Invalid credentials
        res.status(401).send('Invalid email or password.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
