function Footer(){
    return(
        <>
        <div>
            <style>
                {`.footer {
          background: var(--primary-dark);
          border-top: 1px solid rgba(39, 174, 96, 0.2);
          padding: 40px 0;
        }`}
            </style>
            {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-success">HydroMap Pro</h5>
              <p className="text-muted">Leading the future of green hydrogen infrastructure development through intelligent mapping and optimization.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-end gap-3">
                <a href="#" className="text-muted">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
                <a href="#" className="text-muted">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
                <a href="#" className="text-muted">
                  <i className="fas fa-envelope fa-2x"></i>
                </a>
              </div>
              <p className="text-muted mt-3">© 2025 HydroMap Pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
        </div>
        </>
    );
}

export default Footer