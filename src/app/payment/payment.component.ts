import { AfterViewInit, Component, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Smooth scroll to top when this component loads
    this.scrollToTop();
  }
  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
  downloadImage() {
    const download = document.createElement('a');
    download.href = 'assets/donate/Payment_Scanner.jpeg';
    download.download = 'ilanguNgoScanner.jpeg';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }
  copyText(text: string, notifyString: string) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => this.showCopiedToast(notifyString))
        .catch(() => this.fallbackCopyText(text, notifyString));
    } else {
      this.fallbackCopyText(text, notifyString);
    }
  }

  // Fallback for mobile / older browsers
  private fallbackCopyText(text: string, notifyString: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      this.showCopiedToast(notifyString);
    } catch {
      // Fail silently — no error shown to user
    }

    document.body.removeChild(textarea);
  }

  // Simple, clean success toast
  private showCopiedToast(text: string) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: `"${text}" copied!`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }
}
