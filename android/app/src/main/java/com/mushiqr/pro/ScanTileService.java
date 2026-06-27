package com.mushiqr.pro;

import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.service.quicksettings.TileService;

public class ScanTileService extends TileService {
    @Override
    public void onClick() {
        super.onClick();
        
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("action", "scan");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        
        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flag |= PendingIntent.FLAG_IMMUTABLE;
        }

        if (Build.VERSION.SDK_INT >= 34) {
            PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 
                0, 
                intent, 
                flag
            );
            try {
                // Call using PendingIntent
                startActivityAndCollapse(pendingIntent);
            } catch (NoSuchMethodError | Exception e) {
                // Fallback for older signatures or custom roms
                startActivityAndCollapse(intent);
            }
        } else {
            startActivityAndCollapse(intent);
        }
    }
}
