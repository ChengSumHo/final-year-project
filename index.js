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

// Route to create a new user
app.post('/users', async (req, res) => {
    const { user_id, password, email, name } = req.body;

    const { data, error } = await supabase
        .from('users')
        .insert([{ user_id, password, email, name }]);

    if (error) {
        console.error('Error creating user:', error);
        return res.status(400).send('Error creating user: ' + error.message);
    }

    res.status(201).send('User created successfully!');
});

// Route to get a user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', id)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { password, email, name } = req.body;

    const { data, error } = await supabase
        .from('users')
        .update({ password, email, name })
        .eq('user_id', id);

    if (error) {
        console.error('Error updating user:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'User updated successfully', data });
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', id);

    if (error) {
        console.error('Error deleting user:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'User deleted successfully', data });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});