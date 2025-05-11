import emailjs from '@emailjs/browser';

export const sendEmail = (subject: string, to: string, text: string) => {
    
  emailjs.send('service_bscwi4s', 'template_s34rwdj', 
      {
      subject,
      to,
      text
      }
      , 'whWmKQtWdSto4tUqi')
      .then((result) => {
          console.log(result)
      }, (error) => {
          console.log(error.text);
      });
};