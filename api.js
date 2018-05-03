const express = require('express');
const Joi = require('joi');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

const courses = [
    { id: 1, name: 'Course 1'},
    { id: 2, name: 'Course 2'},
    { id: 3, name: 'Course 3'},
    { id: 4, name: 'Course 4'},
    { id: 5, name: 'Course 5'}
];

const schema = {
    name: Joi.string().min(3).required()
};

function validateCourse(course) {
    return Joi.validate(course, schema);
}

app.get('/', (req, res) => {
    res.send('Hello world!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found...');
    res.send(course);
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    const last_id = parseInt(courses[courses.length - 1].id);

    const course = {
        id: last_id + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found...');

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given Id was not found...');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);

});



app.listen(port, () => console.log(`Listening on port ${port}....`));