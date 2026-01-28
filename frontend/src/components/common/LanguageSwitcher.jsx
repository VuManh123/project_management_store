import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useLanguageStore from '../../store/languageStore';
import './LanguageSwitcher.css';

const { Option } = Select;

const LanguageSwitcher = ({ size = 'default', className = '' }) => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const handleChange = (value) => {
    setLanguage(value);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      size={size}
      className={`language-switcher ${className}`}
      suffixIcon={<GlobalOutlined />}
      optionLabelProp="label"
    >
      <Option 
        value="vi" 
        label={
          <div className="language-option">
            <img 
              src="/vietnam_flag.png" 
              alt="Vietnamese" 
              className="language-flag"
            />
            <span>{t('common.vietnamese')}</span>
          </div>
        }
      >
        <div className="language-option">
          <img 
            src="/vietnam_flag.png" 
            alt="Vietnamese" 
            className="language-flag"
          />
          <span>{t('common.vietnamese')}</span>
        </div>
      </Option>
      <Option 
        value="en"
        label={
          <div className="language-option">
            <img 
              src="/english_flag.png" 
              alt="English" 
              className="language-flag"
            />
            <span>{t('common.english')}</span>
          </div>
        }
      >
        <div className="language-option">
          <img 
            src="/english_flag.png" 
            alt="English" 
            className="language-flag"
          />
          <span>{t('common.english')}</span>
        </div>
      </Option>
    </Select>
  );
};

export default LanguageSwitcher;

