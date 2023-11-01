// import { Amplify } from 'aws-amplify';

// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';


// Amplify.configure({
//   aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
//   aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
//   aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
//   aws_user_pools_web_client_id:  process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,
//   google_client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
// });

// export default function App() {
//   return (
//     <Authenticator loginMechanisms={['email']}>
//       {({ signOut, user }) => (
//         <main>
//           <h1>Hello {user?.username}</h1>
//           <button onClick={signOut}>Sign out</button>
//         </main>
//       )}
//     </Authenticator>
//   );
// }










import { useEffect, useState } from "react";
import { Amplify, Auth, Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_yv1oaQm7t",
    userPoolWebClientId: "3ium5p5mrfkubli603dqui7rck",
    oauth: {
      domain: "https://simplehoiku-dev.auth.ap-northeast-1.amazoncognito.com",
      scope: ["openid"],
      redirectSignIn: "https://localhost:3000/",
      redirectSignOut: "https://localhost:3000/",
      responseType: "code",
    },
  },
});

const Example = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  const getUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      // デバッグ用
      Auth.currentSession().then((data) => {
        console.log(`token: ${data.getIdToken().getJwtToken()}`);
      });
      console.log(userData);
      return userData;
    } catch (e) {
      return console.log('Not signed in');
    }
  }

  return user ? (
    <div>
      <p>サインイン済み</p>
      <p>ユーザー名: {user.username}</p>
      <button onClick={() => Auth.signOut()}>Sign Out</button>
    </div>
  ) : (
    <div>
      <p>
        サインインする
      </p>
      <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
    </div>
  );
}

export default Example