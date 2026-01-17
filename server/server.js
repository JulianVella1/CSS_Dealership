const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import User model
const User = require('./models/User');

// Swagger Documentation
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Cars Dealership API',
        description: 'API for managing cars and enquiries',
        version: '1.0.0',
        contact: { name: 'Cars Dealership' }
    },
    servers: [{ url: `http://localhost:${PORT}/api`, description: 'Development Server' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
    },
    paths: {
        '/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' } }, required: ['username', 'password'] } } }
                },
                responses: { 200: { description: 'Login successful with JWT token' }, 401: { description: 'Invalid credentials' } }
            }
        },
        '/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout user',
                responses: { 200: { description: 'Logout successful' } }
            }
        },
        '/cars': {
            get: {
                tags: ['Cars'],
                summary: 'Get all cars',
                parameters: [
                    { name: 'make', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['Available', 'Sold'] } }
                ],
                responses: { 200: { description: 'List of cars' } }
            },
            post: {
                tags: ['Cars'],
                summary: 'Create new car (Admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { make: { type: 'string' }, model: { type: 'string' }, year: { type: 'number' }, price: { type: 'number' }, mileage: { type: 'number' }, condition: { type: 'string' }, description: { type: 'string' }, image: { type: 'string' }, status: { type: 'string' } } } } }
                },
                responses: { 201: { description: 'Car created' }, 403: { description: 'Admin access required' } }
            }
        },
        '/cars/{id}': {
            get: {
                tags: ['Cars'],
                summary: 'Get car by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Car details' }, 404: { description: 'Car not found' } }
            },
            put: {
                tags: ['Cars'],
                summary: 'Update car (Admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
                responses: { 200: { description: 'Car updated' }, 403: { description: 'Admin access required' } }
            },
            delete: {
                tags: ['Cars'],
                summary: 'Delete car (Admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Car deleted' }, 403: { description: 'Admin access required' } }
            }
        },
        '/enquire': {
            post: {
                tags: ['Enquiries'],
                summary: 'Create car enquiry',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { carId: { type: 'string' }, guestName: { type: 'string' }, guestEmail: { type: 'string' }, message: { type: 'string' } } } } }
                },
                responses: { 201: { description: 'Enquiry created' } }
            }
        },
        '/enquiries': {
            get: {
                tags: ['Enquiries'],
                summary: 'Get all enquiries (Admin/Manager only)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'List of enquiries' }, 403: { description: 'Admin/Manager access required' } }
            }
        },
        '/admin/reply': {
            post: {
                tags: ['Enquiries'],
                summary: 'Reply to enquiry (Admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { enquiryId: { type: 'string' }, replyMessage: { type: 'string' } } } } }
                },
                responses: { 200: { description: 'Reply sent' }, 403: { description: 'Admin access required' } }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for Base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api', require('./routes/api'));

// Initialize default users on startup
const initializeDefaultUsers = async () => {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                username: 'admin',
                password: 'admin123',
                role: 'ADMIN'
            });
            await adminUser.save();
            console.log('Default admin user created');
        }

        // Check if manager user exists
        const managerExists = await User.findOne({ username: 'manager' });
        if (!managerExists) {
            const managerUser = new User({
                username: 'manager',
                password: 'manager123',
                role: 'MANAGER'
            });
            await managerUser.save();
            console.log('Default manager user created');
        }
    } catch (err) {
        console.error('Error initializing default users:', err);
    }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Initialize default users after successful connection
        initializeDefaultUsers();
    })
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Cars Dealership API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
