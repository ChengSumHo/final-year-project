const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://cgyqozdsmzorxtacvkvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneXFvemRzbXpvcnh0YWN2a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1Njg0NDAsImV4cCI6MjA0MjE0NDQ0MH0.42U9Gd8uz9YgWW2rXWt8WI9VSZSH9asWRlY3NE5Zk24';
const supabase = createClient(supabaseUrl, supabaseKey);

// Example function to fetch data
async function fetchData() {
  const { data } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
  }
  // Function to update user record
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, photo_url } = req.body;

    const { data, error } = await supabase
        .from('users')
        .update({ name, email, photo_url })
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'User updated successfully', data });

});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'User deleted successfully', data });
});
}
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
fetchData();
app;