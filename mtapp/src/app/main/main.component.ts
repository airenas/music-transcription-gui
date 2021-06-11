import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { TranscribeResult } from '../api/transcribe-result';
import { TranscriptionService } from '../service/transcription.service';
import { FileUtils } from '../utils/file';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  selectedFileName?: string;
  file?: File;
  resultFile?: File;
  resultDwnURL?: string;
  sending?: boolean;
  errorText?: string;

  constructor(private transcriptionSrv: TranscriptionService) {
  }

  ngOnInit(): void {
  }

  dropFile(files: File[], ext: string[], multiple: boolean) {

  }

  openInput() {
    const el = document.getElementById('hiddenFileInput')
    if (el) {
      el.click();
    }
  }

  fileChange(et: EventTarget | null) {
    let f = (et as HTMLInputElement).files;
    if (f !== null && f.length > 0) {
      this.file = f[0];
    } else {
      this.file = undefined;
    }
    this.selectedFileName = this.file?.name;
    this.setAudio();
  }

  setAudio() {
    const el = document.getElementById('player')
    if (el) {
      if (this.file) {
        (el as HTMLAudioElement).src = window.URL.createObjectURL(this.file);
      } else {
        (el as HTMLAudioElement).src = "";
      }
    }
  }

  transcribe() {
    console.log('transcribe');
    if (this.file) {
      this.send(this.file)
    }
  }

  send(file: File) {
    console.log('transcribe');
    this.sending = true;
    this.errorText = '';
    this.resultFile = undefined;

    this.transcriptionSrv.transcribe({ file: file })
      .subscribe(
        result => {
          this.sending = false;
          this.onResult(result);
        },
        error => {
          this.sending = false;
          this.errorText = error;
          console.error(error);
        }
      );
  }

  onResult(result: TranscribeResult): void {
    if ((result.error || '') !== '') {
      this.errorText = result.error
    } else {
      this.setResultFile(result.musicXML || '');
    }
  }

  setResultFile(str: string): void {
    this.resultFile = FileUtils.fromData(atob(str), 'music.xml');
    this.resultDwnURL = window.URL.createObjectURL(this.resultFile);
  }

  saveAs() {
    console.log('saveAs');
    if (this.resultFile) {
      this.saveFile(this.resultFile)
    }
  }

  saveFile(file: File) {
    saveAs(file);
  }
}

