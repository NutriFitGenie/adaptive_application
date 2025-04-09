interface CompleteProps {
    onFinish: () => void;
  }
  
  export default function Complete({ onFinish }: CompleteProps) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="titleText primaryColor1">You're All Set!</h1>
          <p className="miniText secondaryColor mt-2">
            Start your personalised plan!
          </p>
        </div>
  
        <button
          onClick={onFinish}
          className="onboardingNextButton"
        >
          Finish
        </button>
      </div>
    );
  }
  