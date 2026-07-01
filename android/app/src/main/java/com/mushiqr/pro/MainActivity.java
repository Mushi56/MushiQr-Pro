package com.mushiqr.pro;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_REQUEST_CODE = 100;
    private String pendingAction = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Request all needed permissions at launch so they are granted
        // before the user tries to use camera or save files.
        requestAllPermissions();

        // ── Configure WebView for WebRTC / getUserMedia camera streaming ──
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();

        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        // Ensure hardware acceleration is active at the View level.
        // The manifest sets hardwareAccelerated on the <application> tag, but
        // explicitly setting LAYER_TYPE_HARDWARE on the WebView surface prevents
        // software-render fallback that can cause the gray video icon.
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);

        // ── Critical fix: grant WebRTC permission requests from JavaScript ──
        // Without overriding onPermissionRequest, Android WebView silently denies
        // navigator.mediaDevices.getUserMedia even when CAMERA is granted natively,
        // resulting in the gray "paused video" placeholder icon in the viewfinder.
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }
        });

        // Add native JavaScript interface for cold-boot deep-link actions
        webView.addJavascriptInterface(new Object() {
            @android.webkit.JavascriptInterface
            public String getPendingAction() {
                String act = pendingAction;
                pendingAction = null; // consume once
                return act;
            }
        }, "NativeAndroidApp");

        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent != null && "scan".equals(intent.getStringExtra("action"))) {
            pendingAction = "scan";
            // Dispatch custom event for already-running app (hot boot)
            Bridge bridge = getBridge();
            if (bridge != null) {
                final WebView webView = bridge.getWebView();
                if (webView != null) {
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript(
                                "window.dispatchEvent(new CustomEvent('appAction', { detail: 'scan' }));",
                                null
                            );
                        }
                    });
                }
            }
        }
    }

    private void requestAllPermissions() {
        java.util.List<String> needed = new java.util.ArrayList<>();

        // Camera
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.CAMERA);
        }

        // Storage — version-dependent
        if (Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            if (Build.VERSION.SDK_INT <= 32) {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
                    needed.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
                }
            }
        }

        if (!needed.isEmpty()) {
            ActivityCompat.requestPermissions(this,
                    needed.toArray(new String[0]),
                    PERMISSION_REQUEST_CODE);
        }
    }
}
