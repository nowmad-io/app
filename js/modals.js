const defaultMessage = 'An error occurred. Please Try again or contact us at contact@nowmad.io !';

const getModalError = (code, message = defaultMessage) => {
  switch (code) {
    case 'auth/network-request-failed':
      return {
        title: 'Unable to connect',
        information: 'Please check your internet connection or try again later.',
        primaryAction: 'Ok',
      };
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return {
        title: 'Log-in failed',
        information: 'Sorry, the email address and/or the password are incorrect. Please enter the right details or create a new account.',
        primaryAction: 'Ok',
        secondaryAction: 'Show password',
      };
    case 'auth/email-already-in-use':
      return {
        title: 'Creation failed',
        information: 'Sorry, an account already exists with this email. Choose an other email or try to Log-in.',
        primaryAction: 'Ok',
        secondaryAction: 'Log-in',
      };
    default:
      return {
        title: 'Oups !',
        information: message,
        primaryAction: 'Ok',
      };
  }
};

export default getModalError;
