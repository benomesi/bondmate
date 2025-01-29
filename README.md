# BondMate

## Environment Variables

⚠️ **CRITICAL: Environment Variable Management** ⚠️

The following environment variables are required for the application to function properly. Create a `.env` file in the root directory with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration  
VITE_OPENAI_API_KEY=your-api-key

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=your-publishable-key

# Meta Pixel Configuration
VITE_META_PIXEL_ID=your-pixel-id
```

### Important Notes:

1. **NEVER commit the `.env` file to version control**
2. **NEVER modify the `.env` file through automated processes**
3. **Keep `.env` in your `.gitignore`**
4. **Use `.env.example` as a template only**

The `.env` file contains sensitive credentials and should be managed manually. The `.env.example` file serves as a template to show which environment variables are required but should never contain actual credentials.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT