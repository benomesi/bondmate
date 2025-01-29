import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { setDarkMode } from '../store/slices/appSlice';

export function useTheme() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.app.darkMode);

  const toggleTheme = () => {
    dispatch(setDarkMode(!darkMode));
  };

  const theme = {
    isDark: darkMode,
    colors: {
      primary: darkMode ? 'text-blue-400' : 'text-blue-600',
      background: darkMode ? 'bg-gray-900' : 'bg-white',
      text: darkMode ? 'text-white' : 'text-gray-900',
      textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
      border: darkMode ? 'border-gray-700' : 'border-gray-200'
    }
  };

  return { theme, toggleTheme };
}