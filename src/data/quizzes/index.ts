import { attachmentStyleQuiz, attachmentStyleDetails } from './attachmentStyle';
import { loveLanguagesQuiz } from './loveLanguages';
import { personalityAlignmentQuiz, personalityAlignmentDetails } from './personalityAlignment';

export const QUIZZES = {
  attachmentStyle: attachmentStyleQuiz,
  loveLanguages: loveLanguagesQuiz,
  personalityAlignment: personalityAlignmentQuiz
};

export const QUIZ_DETAILS = {
  attachmentStyle: attachmentStyleDetails,
  personalityAlignment: personalityAlignmentDetails
};