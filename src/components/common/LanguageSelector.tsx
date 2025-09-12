import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
    { code: 'kha', name: 'Khasi', nativeName: 'Khasi' },
    { code: 'lus', name: 'Mizo', nativeName: 'Mizo ţawng' },
    { code: 'nag', name: 'Nagamese', nativeName: 'Nagamese' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto min-w-[140px]">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}