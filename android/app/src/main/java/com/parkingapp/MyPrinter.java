package com.parkingapp;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.telecom.Call;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.basewin.aidl.OnPrinterListener;
import com.basewin.define.FontsType;
import com.basewin.define.GlobalDef;
import com.basewin.models.BitmapPrintLine;
import com.basewin.models.PrintLine;
import com.basewin.models.TextPrintLine;
import com.basewin.services.PrinterBinder;
import com.basewin.services.ServiceManager;
import com.basewin.utils.TimerCountTools;
import com.basewin.zxing.utils.QRUtil;

import com.basewin.log.LogUtil;
import com.basewin.models.TextPrintLine;
import com.basewin.services.ServiceManager;

import org.json.JSONException;

public class MyPrinter extends ReactContextBaseJavaModule {
    public boolean printingstatus = true;
    public PrinterListener printer_callback = new PrinterListener();
    private static ReactApplicationContext mContext;

    public MyPrinter(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "MyPrinter";
    }

    @ReactMethod
    public void greet(String name, Promise response) {
        try {
            String res = "hello " + name;
            response.resolve(res);
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    void initPrinter() {
        try {
            ServiceManager.getInstence().init(getReactApplicationContext());
        } catch (Exception e) {
            Log.e("MyPrinter", "Init Exception Thrown.");
        }
    }

    @ReactMethod
    public void centerAlignedPrintText(String msg, int size) {
        try {
            initPrinter();
            ServiceManager.getInstence().getPrinter().setPrintTypesettingType(GlobalDef.PRINTERLAYOUT_TYPESETTING);
            ServiceManager.getInstence().getPrinter().cleanCache();
            ServiceManager.getInstence().getPrinter().setPrintGray(2000);
            ServiceManager.getInstence().getPrinter().setLineSpace(1);
            ServiceManager.getInstence().getPrinter().setPrintFont(FontsType.simsun);
            TextPrintLine textPrintLine = new TextPrintLine();
            textPrintLine.setType(PrintLine.TEXT);
            textPrintLine.setPosition(PrintLine.CENTER);
            textPrintLine.setSize(size);
            textPrintLine.setContent(msg);
            ServiceManager.getInstence().getPrinter().addPrintLine(textPrintLine);
            ServiceManager.getInstence().getPrinter().beginPrint(printer_callback);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void leftAlignedPrintText(String msg, int size) {
        try {
            ServiceManager.getInstence().getPrinter().setPrintTypesettingType(GlobalDef.PRINTERLAYOUT_TYPESETTING);
            ServiceManager.getInstence().getPrinter().cleanCache();
            ServiceManager.getInstence().getPrinter().setPrintGray(2000);
            ServiceManager.getInstence().getPrinter().setLineSpace(1);
            ServiceManager.getInstence().getPrinter().setPrintFont(FontsType.simsun);
            TextPrintLine textPrintLine = new TextPrintLine();
            textPrintLine.setType(PrintLine.TEXT);
            textPrintLine.setPosition(PrintLine.LEFT);
            textPrintLine.setSize(size);

            textPrintLine.setContent(msg);
            ServiceManager.getInstence().getPrinter().addPrintLine(textPrintLine);
            ServiceManager.getInstence().getPrinter().beginPrint(printer_callback);
        } catch (Exception e) {
            Log.e("MyPrinter", "Error in leftAlignedPrintText", e);
        }
    }

    @ReactMethod
    public void rightAlignedPrintText(String msg, int size) {
        try {
            ServiceManager.getInstence().getPrinter().setPrintTypesettingType(GlobalDef.PRINTERLAYOUT_TYPESETTING);
            ServiceManager.getInstence().getPrinter().cleanCache();
            ServiceManager.getInstence().getPrinter().setPrintGray(2000);
            ServiceManager.getInstence().getPrinter().setLineSpace(1);
            ServiceManager.getInstence().getPrinter().setPrintFont(FontsType.simsun);
            TextPrintLine textPrintLine = new TextPrintLine();
            textPrintLine.setType(PrintLine.TEXT);
            textPrintLine.setPosition(PrintLine.RIGHT);
            textPrintLine.setSize(size);
            textPrintLine.setContent(msg);
            ServiceManager.getInstence().getPrinter().addPrintLine(textPrintLine);
            ServiceManager.getInstence().getPrinter().beginPrint(printer_callback);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void printQRCode(String printContent) {
        try {
            initPrinter();
            ServiceManager.getInstence().getPrinter().setPrintGray(3000);
            ServiceManager.getInstence().getPrinter().cleanCache();
            BitmapPrintLine bitmapPrintLine = new BitmapPrintLine();
            bitmapPrintLine.setType(PrintLine.BITMAP);
            bitmapPrintLine.setPosition(PrintLine.CENTER);
            //create QR code(max height is 384px)
            Bitmap bitmap = QRUtil.getRQBMP(printContent, 240);
            bitmapPrintLine.setBitmap(bitmap);
            ServiceManager.getInstence().getPrinter().addPrintLine(bitmapPrintLine);
            ServiceManager.getInstence().getPrinter().beginPrint(printer_callback);
            ServiceManager.getInstence().getPrinter().setPrintGray(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//    @ReactMethod
//    public void printText(Callback callback) {
//        try {
//            initPrinter(callback);
////        centerAlignedPrintText("TAX INVOICE", TextPrintLine.FONT_LARGE);    //20 Chars
//            centerAlignedPrintText("SYNERGIC SOFTEK SOLUTIONS PVT. LTD.", TextPrintLine.FONT_LARGE);
//            //32 Chars
//            rightAlignedPrintText("--------------------------------", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("PRODUCT NAME               RATE ", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("QTY      UNIT               AMT ", TextPrintLine.FONT_NORMAL);
//            rightAlignedPrintText("--------------------------------", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXXXXXXXXXXXX     XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXX.XX  XXX       XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            rightAlignedPrintText("--------------------------------", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXXXXXXXXXXXX     XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXX.XX  XXX       XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            rightAlignedPrintText("--------------------------------", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXXXXXXXXXXXX     XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("XXXX.XX  XXX       XXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
//            rightAlignedPrintText("--------------------------------", TextPrintLine.FONT_NORMAL);
//            centerAlignedPrintText("TOTAL            XXXXXXXXXXX.XX ", TextPrintLine.FONT_NORMAL);
////        paperFeed(1, TextPrintLine.FONT_SMALL);
////            printQRCode("Some*25*78*gsayftsyadfas*Cykablayttt!!!");
//            centerAlignedPrintText("THANKYOU", TextPrintLine.FONT_LARGE);//48 Chars
//            paperFeed(3);
//        } catch (Exception e) {
//            callback.invoke(e, null);
//        }
//    }


    public void paperFeed(int lines) {
        try {
            ServiceManager.getInstence().getPrinter().cleanCache();
            TextPrintLine textPrintLine = new TextPrintLine();
            textPrintLine.setType(PrintLine.TEXT);
            textPrintLine.setPosition(PrintLine.CENTER);
            textPrintLine.setSize(TextPrintLine.FONT_NORMAL);
            for (int loop = 0; loop < lines; loop++) {
                textPrintLine.setContent("                               ");
                ServiceManager.getInstence().getPrinter().addPrintLine(textPrintLine);
            }
            ServiceManager.getInstence().getPrinter().beginPrint(printer_callback);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public class PrinterListener implements OnPrinterListener {
        @Override
        public void onStart() {
            Log.d("PrinterListener", "start print");
            printingstatus = false;
        }

        @Override
        public void onFinish() {
            // End of the print
            Log.d("PrinterListener", "Print success");
            printingstatus = true;

        }

        @Override
        public void onError(int errorCode, String detail) {
            // print error
            Log.d("PrinterListener", "print error" + " errorcode = " + errorCode + " detail = " + detail);
            printingstatus = true;
            if (errorCode == PrinterBinder.PRINTER_ERROR_NO_PAPER) {
                Toast.makeText(mContext, "Insufficient Paper", Toast.LENGTH_LONG).show();
            }
            if (errorCode == PrinterBinder.PRINTER_ERROR_OVER_HEAT) {
                Toast.makeText(mContext, "Device Over heated", Toast.LENGTH_LONG).show();
            }
            if (errorCode == PrinterBinder.PRINTER_ERROR_OTHER) {
                Toast.makeText(mContext, "Insufficient Paper", Toast.LENGTH_LONG).show();
            }
        }
    }
}
