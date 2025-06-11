flowchart TD
    Start[Start] --> Onboarding[Onboarding and Account Setup]
    Onboarding --> Auth[Sign Up or Login]
    Auth --> Walkthrough[First Time Walkthrough]
    Walkthrough --> Dashboard[Main Dashboard]
    Dashboard --> Reflection[Daily Reflection]
    Dashboard --> QMgmt[Question Management]
    Dashboard --> Progress[Progress Tracking]
    Dashboard --> Settings[Settings]
    Reflection --> Input[Display Todays Questions]
    Input --> Autosave[Autosave Answers]
    Input --> Skip[Skip Question]
    Autosave --> Confirm[Completion Confirmation]
    Skip --> Dashboard
    Confirm --> Update[Update Streak and Stats]
    Update --> Dashboard
    QMgmt --> Create[Create Question]
    QMgmt --> Edit[Edit Question]
    QMgmt --> Archive[Archive Question]
    QMgmt --> Delete[Delete Question]
    Create --> QMgmt
    Edit --> QMgmt
    Archive --> QMgmt
    Delete --> QMgmt
    QMgmt --> Dashboard
    Progress --> Calendar[Calendar View]
    Progress --> Charts[Chart View]
    Calendar --> Progress
    Charts --> Progress
    Progress --> Dashboard
    Settings --> Notif[Notification Settings]
    Settings --> Profile[Profile and Account Settings]
    Settings --> Export[CSV Export]
    Notif --> Settings
    Profile --> Settings
    Export --> Settings
    Settings --> Dashboard