// ES6 module syntax
import LocalizedStrings from 'react-localization';

export const strings = new LocalizedStrings(
  {
    en: {
      util: {
        app_name: 'StageWhisper',
        buttons: {
          // Window Actions
          open: 'Open',
          close: 'Close',

          // Process Actions
          cancel: 'Cancel',
          confirm: 'Confirm',
          retry: 'Retry',
          resume: 'Resume',
          submit: 'Submit',
          stop: 'Stop',
          start: 'Start',

          // File Actions
          delete: 'Delete',
          edit: 'Edit',
          save: 'Save',
          upload: 'Upload',
          export: 'Export',
          uploadFile: 'Upload File',
          uploadFiles: 'Upload Files',
          uploadFolder: 'Upload Folder',
          uploadFolders: 'Upload Folders',
          restore: 'Restore',

          // User Actions
          login: 'Login',
          logout: 'Logout',

          // Media Actions
          play: 'Play',
          next: 'Next',
          previous: 'Previous',
          pause: 'Pause',

          // Queue Actions
          queue: 'Queue',
          download: 'Download',
          transcribe: 'Transcribe'
        },
        time: {
          seconds: 'seconds',
          second: 'second',
          minutes: 'minutes',
          minute: 'minute',
          hours: 'hours',
          hour: 'hour',
          days: 'days',
          day: 'day',
          weeks: 'weeks',
          week: 'week',
          months: 'months',
          month: 'month',
          years: 'years',
          year: 'year'
        },

        // Generic Labels
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        unknownError: 'Unknown error',
        unknownWarning: 'Unknown warning',
        unknownInfo: 'Unknown info',
        unknown: 'Unknown',
        on: 'On',
        off: 'Off',
        enabled: 'Enabled',
        disabled: 'Disabled',
        status: {
          idle: 'Idle',
          status: 'Status',
          saving: 'Saving...',
          loading: 'Loading...',
          pending: 'Pending',
          processing: 'Processing',
          complete: 'Complete',
          error: 'Error',
          cancelled: 'Cancelled',
          deleted: 'Deleted',
          paused: 'Paused',
          queued: 'Queued',
          stalled: 'Stalled',
          created: 'Created',
          updated: 'Updated',
          duration: 'Duration',
          success: 'Success',
          unknown: 'Unknown'
        }
      },

      // Text for the transcribe page which allows the user to input files and transcribe them
      input: {
        title: 'Input',
        prompt: 'Add a file, folder, or URL to transcribe',
        submit_button: 'Submit',
        // Each of the following are the labels for the input fields separated by the type of input
        audio: {
          title: 'Audio',
          prompt: 'Select audio file from your computer',
          placeholder: 'Interview.mp3',
          limits: 'MP3, WAV, FLAC, OGG, AAC, M4A, WMA, and OPUS files are recommended',
          invalid: 'Invalid audio file'
        },
        directory: {
          title: 'Output Directory',
          prompt: 'Select a directory to save the output',
          placeholder: 'Select an output directory',
          not_functional: 'Not functional yet, will just save to desktop'
        },
        language: {
          title: 'Language',
          prompt: 'Language spoken in the audio, specify none to perform automatic language detection',
          placeholder: 'Select a language',
          non_english_warning: 'Note: Languages other than english may have an increased error rate'
        },
        about: {
          title: 'About',
          prompt: 'About this file',
          tags: {
            title: 'Tags',
            prompt: 'Tags to associate with this file, comma separated',
            placeholder: 'interview, 2021, pulitzer...'
          },
          description: {
            title: 'Description',
            prompt: 'Description of this file, what is it about?',
            placeholder: 'The interview with the president of the moon'
          },
          name: {
            title: 'Name',
            prompt: 'Name of this file',
            placeholder: 'Moon-ter-view'
          }
        },
        modal: {
          title: 'Input',
          success_queue: 'Successfully added entry to queue',
          success_add: 'Entry successfully added!',
          error: 'Error adding entry',
          error_queue: 'Error adding entry to queue',
          add_another: 'Add another file',
          add_queue: 'Add to queue',
          view_queue: 'View queue',
          view_entries: 'View entries'
        },

        // The following are the labels for the models that can be used for transcription, each has a title and a description of the model.
        // These descriptions are used in the tooltip and inform the user of the model's accuracy and speed. This is not final and will be updated as we get more information on the models.
        models: {
          title: 'AI Model',
          options: {
            tiny: {
              title: 'Tiny',
              description: 'This is the smallest model, it is the fastest but struggles with non english languages'
            },
            base: {
              title: 'Base',
              description:
                'This is the default model, it is a good balance of speed and accuracy for english transcription'
            },
            small: {
              title: 'Small',
              description:
                'This is a larger model that is suitable for non-english language transcription and translation'
            },
            medium: {
              title: 'Medium',
              description:
                'This is a large model that can be used with any language, if using english this will likely be the best model for most people'
            },
            large: {
              title: 'Large',
              description:
                'This is the largest model, it is the most accurate but also the slowest. It requires a lot of memory to run'
            }
          }
        }
      },

      // Text for the simple file input page
      simpleInput: {
        title: 'Input',
        drag_drop: 'Drag and drop your audio file here, or click to select a file from your computer',
        tip: 'MP3, WAV, FLAC, OGG, AAC, M4A, WMA, and OPUS files are recommended'
      },
      // Text for the transcriptions page which shows the user a list of all their transcriptions
      entries: {
        title: 'Entries', // Title of the page
        recent_transcriptions: 'Recent entries', // Title of the recent entries section
        buttons: {
          transcribe: 'Transcribe', // Button to transcribe a new file
          re_transcribe: 'Re-Transcribe',
          add_to_queue: 'Add to Queue'
        },
        // Text for the table that shows the user a list of all their entries and their status
        card: {
          // Audio
          audio_section_title: 'Audio File', // Label for the audio file card
          file_name: 'Name', // The name of the file that was transcribed
          file_type: 'Type', // This is the type of file, ie mp3, wav, etc
          file_length: 'Length', // Length of the file in seconds
          file_language: 'Language', // The language of the input audio file
          added: 'Added', // The date the file was added to the system

          // Transcription
          transcription_section_title: 'Transcription', // Title of the card that shows information about the transcription
          output_directory: 'Location', // The directory that the file was saved to
          completed_on: 'Completed', // What time the transcription was completed
          never_completed: 'Never', // If the transcription has never been completed
          model_used: 'Model', // Which model was used to transcribe the file
          transcript_length: 'Transcript Length', // How long the transcript is in words
          no_transcription: 'No transcription' // If there is no transcription for the file
        }
      },
      // Text for the dashboard home page
      dashboard: {
        title: 'Dashboard',
        subtitle: 'View and manage your transcription jobs',
        no_jobs: 'No jobs found',
        job: {
          title: 'Job',
          subtitle: 'View and manage your transcription job',

          progress: {
            title: 'Progress',
            subtitle: 'Progress of the job'
          }
        }
      },
      // Text for the interview mode where a user can record audio and have it transcribed in real time
      interview: {
        title: 'Interview',
        subtitle: 'Record an interview and transcribe it'
      },
      // Text for the settings page
      settings: {
        title: 'Settings',
        subtitle: 'Manage your account settings',
        dark_mode: 'Dark Mode',
        toggle_dark_mode: 'Toggle dark mode',
        debug_menu: 'Debug Menu',
        language: {
          title: 'Language',
          subtitle:
            'This is the language that the application will be displayed in, it will not affect the language of the transcriptions',
          prompt: 'Select a language for the application',
          placeholder: 'Select a language'
        },
        large_model_support: {
          title: 'Large Model Support',
          subtitle:
            'This will enable the use of the large models, this will require a significant amount of memory and is not suitable for most users'
        },
        audio_padding_amount: {
          title: 'Audio Padding Amount',
          subtitle:
            'This is the amount of padding (in seconds) that will be added to the beginning and end of the audio file when transcribing, this can enhance the listening and reviewing experience'
        }
      },
      // Text for the about page
      about: {
        title: 'About',
        subtitle: 'Learn more about Stage Whisper',
        github: 'GitHub',
        discord: 'Discord',
        twitter: 'Twitter',
        email: 'Email',
        privacy_policy: 'Privacy Policy',
        terms_of_service: {
          title: 'Terms of Service',
          subtitle: 'Terms of Service for Stage Whisper',
          paragraph1: 'By using Stage Whisper you agree to the following terms of service: XYZ'
        }
      },
      // Text for the sidebar which shows recent transcriptions
      sidebar: {
        title: 'Recent Transcriptions'
      },
      languages: {
        Afrikaans: 'Afrikaans',
        Albanian: 'Albanian',
        Amharic: 'Amharic',
        Arabic: 'Arabic',
        Armenian: 'Armenian',
        Assamese: 'Assamese',
        Azerbaijani: 'Azerbaijani',
        Bashkir: 'Bashkir',
        Basque: 'Basque',
        Belarusian: 'Belarusian',
        Bengali: 'Bengali',
        Bosnian: 'Bosnian',
        Breton: 'Breton',
        Bulgarian: 'Bulgarian',
        Burmese: 'Burmese',
        Castilian: 'Castilian',
        Catalan: 'Catalan',
        Chinese: 'Chinese',
        Croatian: 'Croatian',
        Czech: 'Czech',
        Danish: 'Danish',
        Dutch: 'Dutch',
        English: 'English',
        Estonian: 'Estonian',
        Faroese: 'Faroese',
        Finnish: 'Finnish',
        Flemish: 'Flemish',
        French: 'French',
        Galician: 'Galician',
        Georgian: 'Georgian',
        German: 'German',
        Greek: 'Greek',
        Gujarati: 'Gujarati',
        Haitian: 'Haitian',
        'Haitian Creole': 'Haitian Creole',
        Hausa: 'Hausa',
        Hawaiian: 'Hawaiian',
        Hebrew: 'Hebrew',
        Hindi: 'Hindi',
        Hungarian: 'Hungarian',
        Icelandic: 'Icelandic',
        Indonesian: 'Indonesian',
        Italian: 'Italian',
        Japanese: 'Japanese',
        Javanese: 'Javanese',
        Kannada: 'Kannada',
        Kazakh: 'Kazakh',
        Khmer: 'Khmer',
        Korean: 'Korean',
        Lao: 'Lao',
        Latin: 'Latin',
        Latvian: 'Latvian',
        Letzeburgesch: 'Letzeburgesch',
        Lingala: 'Lingala',
        Lithuanian: 'Lithuanian',
        Luxembourgish: 'Luxembourgish',
        Macedonian: 'Macedonian',
        Malagasy: 'Malagasy',
        Malay: 'Malay',
        Malayalam: 'Malayalam',
        Maltese: 'Maltese',
        Maori: 'Maori',
        Marathi: 'Marathi',
        Moldavian: 'Moldavian',
        Moldovan: 'Moldovan',
        Mongolian: 'Mongolian',
        Myanmar: 'Myanmar',
        Nepali: 'Nepali',
        Norwegian: 'Norwegian',
        Nynorsk: 'Nynorsk',
        Occitan: 'Occitan',
        Panjabi: 'Panjabi',
        Pashto: 'Pashto',
        Persian: 'Persian',
        Polish: 'Polish',
        Portuguese: 'Portuguese',
        Punjabi: 'Punjabi',
        Pushto: 'Pushto',
        Romanian: 'Romanian',
        Russian: 'Russian',
        Sanskrit: 'Sanskrit',
        Serbian: 'Serbian',
        Shona: 'Shona',
        Sindhi: 'Sindhi',
        Sinhala: 'Sinhala',
        Sinhalese: 'Sinhalese',
        Slovak: 'Slovak',
        Slovenian: 'Slovenian',
        Somali: 'Somali',
        Spanish: 'Spanish',
        Sundanese: 'Sundanese',
        Swahili: 'Swahili',
        Swedish: 'Swedish',
        Tagalog: 'Tagalog',
        Tajik: 'Tajik',
        Tamil: 'Tamil',
        Tatar: 'Tatar',
        Telugu: 'Telugu',
        Thai: 'Thai',
        Tibetan: 'Tibetan',
        Turkish: 'Turkish',
        Turkmen: 'Turkmen',
        Ukrainian: 'Ukrainian',
        Urdu: 'Urdu',
        Uzbek: 'Uzbek',
        Valencian: 'Valencian',
        Vietnamese: 'Vietnamese',
        Welsh: 'Welsh',
        Yiddish: 'Yiddish',
        Yoruba: 'Yoruba'
      }
    },
    // Turkish translation -- Ai
    // FIXME: This is a placeholder translation
    tr: {
      util: {
        app_name: 'Turkish - Stage Whisper - Needs Translation',

        buttons: {
          cancel: '??ptal - temp',
          close: 'Kapat - temp',
          confirm: 'Onayla -temp'
        }
      },
      input: {
        title: 'De??ifre',
        submit_button: 'G??nder',
        audio: {
          title: 'Ses',
          prompt: 'Ses dosyas??n?? se??in veya buraya s??r??kleyip b??rak??n',
          placeholder: 'R??portaj.mp3'
        },
        directory: {
          title: '????kt?? Klas??r??',
          prompt: '????kt??y?? kaydetmek i??in bir klas??r se??in',
          placeholder: 'Bir klas??r se??in',
          not_functional: 'Hen??z ??al????m??yor, masa??st??ne kaydedilecek'
        },
        language: {
          title: 'Dil',
          prompt: 'Kay??tta konu??ulan dili belirtin, dilin otomatik alg??lanmas?? i??in bo?? b??rak??n',
          placeholder: 'Bir dil se??in',
          non_english_warning: 'Not: ??ngilizce d??????ndaki dillerde do??ruluk pay?? daha d??????k olabilir'
        },
        models: {
          title: 'AI Modeli',
          options: {
            tiny: {
              title: 'Tiny',
              description: 'En k??????k en h??zl?? ??al????an model. ??ngilizce d??????ndaki dillerde zorlanabilir.'
            },
            base: {
              title: 'Base',
              description:
                '??ntan??ml?? gelen model. ??ngilizce de??ifresi i??in h??z ve do??ruluk a????s??ndan iyi bir denge sa??lar.'
            },
            small: {
              title: 'Small',
              description: 'Daha b??y??k bir model. ??ngilizce d?????? dil de??ifresinde ve ??evirisinde kullan??ma uygundur.'
            },
            medium: {
              title: 'Medium',
              description:
                'B??y??k bir model. Herhangi bir dil i??in kullan??labilir. ??ngilizce kullan??lacaksa ??o??u insan i??in en iyi sonucu verecektir.'
            },
            large: {
              title: 'Large',
              description:
                'En b??y??k model. Do??ruluk pay?? di??erlerinden daha y??ksek ancak ??al????ma h??z?? di??erlerinden yava??t??r. ??al????t??rmak i??in ??ok y??ksek bellek gerektirir.'
            }
          }
        }
      },
      dashboard: {
        title: 'Kontrol Paneli',
        subtitle: 'De??ifre i??lemlerinizi g??r??nt??leyin ve y??netin',
        no_jobs: '????lem bulunmamaktad??r',
        job: {
          title: '????lem',
          subtitle: 'De??ifre i??leminizi g??r??nt??leyin ve y??netin',
          status: {
            title: 'Durum',
            options: {
              pending: 'Bekliyor',
              processing: '????leniyor',
              complete: 'Tamamland??',
              error: 'Hata'
            }
          },
          progress: {
            title: '??lerleyi??',
            subtitle: '????lem ilerleyi??i'
          },
          output: {
            title: '????kt??',
            subtitle: '????lemin ????kt??s??',
            download: '??ndir'
          },
          error: {
            title: 'Hata',
            subtitle: '????lemden gelen hata mesaj??'
          },
          delete: 'Sil'
        }
      },
      interview: {
        title: 'R??portaj',
        subtitle: 'R??portaj kaydedin ve de??ifre edin',
        record: {
          title: 'Kay??t',
          subtitle: 'R??portaj kaydedin',
          start: 'Ba??lat',
          stop: 'Durdur',
          pause: 'Duraklat',
          resume: 'Devam et',
          recording: 'Kaydediliyor...',
          paused: 'Duraklat??ld??',
          stopped: 'Durduruldu'
        }
      },
      settings: {
        title: 'Ayarlar',
        subtitle: 'Hesap ayarlar??n??z?? y??netin',
        toggle_dark_mode: 'Karanl??k Modu A??/Kapa',
        language: {
          title: 'Dil',
          subtitle: 'Uygulaman??n dilini de??i??tirin',
          prompt: 'Bir dil se??in',
          placeholder: 'Bir dil se??in'
        }
      },
      about: {
        title: 'Hakk??nda',
        subtitle: 'Stage Whisper hakk??nda daha fazla bilgi edinin',
        github: 'GitHub',
        discord: 'Discord',
        twitter: 'Twitter',
        email: 'Email',
        privacy_policy: 'Gizlilik Politikas??',
        terms_of_service: 'Hizmet ??artlar??'
      },
      sidebar: {
        title: 'Son De??ifreler'
      },
      languages: {
        en: '??ngilizce',
        tr: 'T??rk??e',
        fr: 'Frans??zca'
      }
    },
    // French translation -- Ai
    fr: {
      util: {
        app_name: 'French - Stage Whisper - Needs Translation'
      },
      languages: {
        fr: 'Fran??ais',
        en: 'Anglais'
      }
    },
    // German translation -- Ai
    de: {
      util: {
        app_name: 'German - Stage Whisper - Needs Translation'
      },
      languages: {
        de: 'Deutsch',
        en: 'Englisch'
      }
    },
    // Spanish translation -- Ai
    es: {
      util: {
        app_name: 'Spanish - Stage Whisper - Needs Translation'
      },
      languages: {
        es: 'Espa??ol',
        en: 'Ingl??s'
      }
    }
  },
  {
    logsEnabled: false, // Enable or disable logs
    pseudo: false // Set to true to insert garbage characters into the strings to test localization
  }
);
export default strings;
