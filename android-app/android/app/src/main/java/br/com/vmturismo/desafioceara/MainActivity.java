package br.com.vmturismo.desafioceara;

import android.os.Bundle;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * Modo totem: tela cheia (sem barras do Android), tela sempre acesa.
 * As barras só reaparecem por um instante se alguém deslizar o dedo da borda.
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        esconderBarras();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) esconderBarras();
    }

    private void esconderBarras() {
        WindowInsetsControllerCompat controle =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controle.hide(WindowInsetsCompat.Type.systemBars());
        controle.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
