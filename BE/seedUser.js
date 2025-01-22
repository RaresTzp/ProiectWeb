

import { sequelize } from './sequelize.js'; 
import { User } from './models/user.js'; 
import bcrypt from 'bcrypt'; 
const SALT_ROUNDS = 10;

const createUsers = async () => {
    try {
      
        await sequelize.authenticate();
        console.log('Database connection established.');

        const users = [
            {
                name: 'Andrei Popescu',
                email: 'andrei.popescu@gmail.com',
                password: 'andreipopescu', 
                account_type: 'student',
                student_number: 123456
            },
            {
                name: 'Ana Popa',
                email: 'ana.popa@gmail.com',
                password: 'anapopa', 
                account_type: 'student', 
                student_number: 123457 
            },

            {
                name: 'Mihai Constantin',
                email: 'mihai.constantin@gmail.com',
                password: 'mihaiconstantin', 
                account_type: 'student', 
                student_number: 123458 
            },

            {
                name: 'Alexandru Vasile',
                email: 'alexandru.vasile@gmail.com',
                password: 'alexandruvasile', 
                account_type: 'profesor', 
                student_number: 123459 
            },

            {
                name: 'Radu Andrei',
                email: 'radu.andrei@gmail.com',
                password: 'raduandrei', 
                account_type: 'profesor', 
                student_number: 223456 
            },

            {
                name: 'Cosmin Bogdan',
                email: 'cosmin.bogdan@gmail.com',
                password: 'cosminbogdan',
                account_type: 'profesor', 
                student_number: 223457
            }
            
        ];

        for (const userData of users) {
            
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
            userData.password = hashedPassword;

            const user = await User.create(userData);
            console.log(`User created successfully: ${user.name} (${user.email})`);
        }

        console.log('All users have been created.');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
       
        await sequelize.close();
        console.log('Database connection closed.');
    }
};


createUsers();
