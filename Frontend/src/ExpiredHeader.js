const Expired = () => {
    return (
        <div>
            <div className="bg-danger text-white text-center p-3">
                <strong>Your subscription has expired.</strong><br />
                Your account will be deleted in 30 days if not renewed. You can renew your subscription in the Settings tab.
            </div>
        </div>
    );
};

export default Expired;
