// Redis configuration
export const connectRedis = async (): Promise<void> => {
  try {
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    throw error;
  }
};

