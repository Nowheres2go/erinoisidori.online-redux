# BigCartel Custom CSS Setup Guide

This guide explains how to apply the brutalist design CSS to your BigCartel store to match your website's aesthetic.

## How to Add Custom CSS to BigCartel

1. **Log into your BigCartel account**
   - Go to https://erinoisidorionline.bigcartel.com/admin
   - Sign in with your credentials

2. **Navigate to Theme Settings**
   - Click on **"Design"** in the admin menu
   - Select **"Theme"** or **"Customize Theme"**

3. **Add Custom CSS**
   - Look for a section called **"Custom CSS"**, **"Additional CSS"**, or **"Code"**
   - If you don't see this option, look for **"Integration Code"** or **"Advanced"** settings
   - Copy the entire contents of `bigcartel-custom.css`
   - Paste it into the custom CSS field

4. **Alternative: Integration Code Method**
   - If BigCartel doesn't have a direct CSS field, you can use Integration Code
   - Go to **"Settings"** → **"Integration Code"**
   - Add this in the `<head>` section:
   ```html
   <link rel="stylesheet" href="https://yourdomain.com/bigcartel-custom.css">
   ```
   - Or paste the CSS directly in a `<style>` tag:
   ```html
   <style>
   /* Paste bigcartel-custom.css contents here */
   </style>
   ```

5. **Save and Preview**
   - Click **"Save"** or **"Update"**
   - Preview your store to see the changes
   - The design should now match your brutalist website aesthetic

## Design Features Applied

- **Color Scheme:**
  - Background: #d9d9d9 (grey)
  - Primary Text: Black
  - Accent: #FCBE11 (yellow)
  - Borders: #104626 (green)
  - Cards: Antiquewhite

- **Typography:**
  - Font: Times New Roman (matching your site)
  - Bold, italic styling
  - Uppercase headers with letter spacing

- **Brutalist Design:**
  - No rounded corners (border-radius: 0)
  - Bold borders (5px solid)
  - Sharp edges
  - High contrast colors
  - Text shadows on hover

- **Interactive Elements:**
  - Hover effects with text shadows
  - Button color inversions on hover
  - Drop shadows on product cards

## Troubleshooting

If the CSS doesn't apply:
1. Check that BigCartel allows custom CSS (some themes may restrict this)
2. Try using `!important` flags (already included in the CSS)
3. Clear your browser cache
4. Check BigCartel's documentation for the latest method to add custom CSS

## Notes

- The CSS uses `!important` flags to override BigCartel's default styles
- All border-radius values are set to 0 for the brutalist aesthetic
- Colors match your main website exactly
- Typography uses Times New Roman to match your site's font

