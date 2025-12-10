import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

let sequelize = null;
let initialized = false;
let initError = null;

export const getDatabase = () => {
  // Return cached instance if already initialized
  if (sequelize) return sequelize;
  
  // Return null if already tried to initialize and failed
  if (initialized && initError) return null;
  if (initialized) return null;

  try {
    // Mark as initialized first to prevent multiple attempts
    initialized = true;
    
    // Log environment variables for debugging
    const config = {
      database: process.env.DATABASE_NAME || 'mindcare_db',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT || 3306,
    };
    
    console.log('[DB] Initializing with config:', config);
    
    // Only try to create Sequelize at runtime, not at compile time
    sequelize = new Sequelize(
      config.database,
      config.user,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        dialectModule: mysql2,
        logging: false,
        // Prevent connection pooling in dev to reduce connection errors
        pool: {
          max: 2,
          min: 0,
          acquire: 15000,
          idle: 5000,
        },
        // Disable SSL warnings
        dialectOptions: {
          supportBigNumbers: true,
          bigNumberStrings: true,
        }
      }
    );
    
    console.log('[DB] Database instance created successfully');
    return sequelize;
  } catch (error) {
    initError = error;
    console.error('[DB] Initialization error:', error.message);
    return null;
  }
};

// Don't export default - force explicit function call
export default null;
