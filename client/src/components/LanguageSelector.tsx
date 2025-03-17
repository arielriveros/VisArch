import { useTranslation } from 'react-i18next';
import LanguageIcon from '@/assets/icons/language.png';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <span className='text-xs content-center justify-center'>
      <div className='w-full flex justify-center items-center'>
        <img src={LanguageIcon} alt='Language' className='w-4 h-4' />
      </div>
      <select className='bg-transparent' onChange={(e) => i18n.changeLanguage(e.target.value)}>
        <option className='text-black' value="en">English</option>
        <option className='text-black' value="es">Español</option>
      </select>
    </span>
  );
}
