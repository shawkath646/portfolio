const maintenanceHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Under Maintenance | Cloudburst Lab</title>
    <style>
        :root { 
            --bg-color: #0f172a; 
            --card-bg: rgba(255, 255, 255, 0.03); 
            --border-color: rgba(255, 255, 255, 0.08); 
            --text-main: #f8fafc; 
            --text-muted: #94a3b8; 
            --accent: #3b82f6; 
            --accent-hover: #2563eb; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; 
            background-color: var(--bg-color); 
            color: var(--text-main); 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            padding: 20px; 
            text-align: center; 
        }
        .maintenance-container { 
            max-width: 560px; 
        }
        .brand-logo { 
            width: 90px; 
            height: auto; 
            margin-bottom: 24px; 
            object-fit: contain; 
        }
        h1 { 
            font-size: 2rem; 
            margin-bottom: 16px; 
            font-weight: 700; 
            letter-spacing: -0.025em; 
        }
        p { 
            font-size: 1rem; 
            line-height: 1.6; 
            color: var(--text-muted); 
            margin-bottom: 32px; 
        }
        .footer { 
            border-top: 1px solid var(--border-color); 
            padding-top: 24px; 
            font-size: 0.875rem; 
            color: var(--text-muted); 
            line-height: 1.6; 
        }
        .footer strong { 
            color: var(--text-main); 
            font-weight: 600; 
        }
    </style>
</head>
<body>
    <div class="maintenance-container">
        <img src="https://cloudburstlab.vercel.app/api/branding/logo?varient=transparent" alt="Cloudburst Lab Logo" class="brand-logo">
        
        <h1>System Under Maintenance</h1>
        <p>We're currently performing scheduled updates to improve our platform. Everything will be back online shortly. Thank you for your patience!</p>
                
        <div class="footer">
            Maintained by <strong>Cloudburst Lab</strong><br>
            Developer: @shawkath646
        </div>
    </div>
</body>
</html>`;

export default maintenanceHTML;