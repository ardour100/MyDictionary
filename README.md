# MyDictionary Project
<img width="358" height="391" alt="image" src="https://github.com/user-attachments/assets/252a9176-555c-461b-a657-995ea8089e98" />  <img width="369" height="304" alt="image" src="https://github.com/user-attachments/assets/4300e87d-1000-4035-9f5c-a6563c532f38" />


## Architecture Notes
- **Full-Stack Application:** Frontend integrated with Supabase backend  
- **Data Persistence:** User bookmarks stored in Supabase PostgreSQL database  
- **Authentication:** Google OAuth via Supabase Auth  

### Component Architecture
- **Main logic:** `App.jsx`  
- **Modular components:** Handle user display, bookmarking, and bookmark management  

### External Dependencies
- **Dictionary API:** [api.dictionaryapi.dev](https://api.dictionaryapi.dev) for word definitions  
- **Supabase:** Authentication and data storage  

### State Management
- React hooks combined with Supabase real-time subscriptions  

### Security
- Row Level Security (RLS) policies ensure users only access their own bookmarks  

### Responsive Design
- Mobile-friendly using Tailwind CSS responsive classes  
