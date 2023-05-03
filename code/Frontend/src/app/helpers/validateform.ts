import { FormControl, FormGroup} from '@angular/forms';
export default class ValidateForm{
  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf: true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }});
  }
}

/*
Die Methode "validateAllFormFields" validiert alle Felder eines FormGroup, 
indem sie rekursiv alle FormControl- und FormGroup-Instanzen durchläuft und das "markAsDirty" -Flag setzt, 
um anzuzeigen, dass das Steuerelement als bearbeitet markiert wurde.
Konkret durchläuft die Methode alle Felder des FormGroup-Objekts mit Hilfe der "Object.keys" -Funktion, 
um eine Liste der Eigenschaften des Objekts abzurufen. 
Für jede Eigenschaft überprüft die Methode, ob es sich um ein FormControl oder ein FormGroup handelt.
Wenn es sich um ein FormControl handelt, 
wird das "markAsDirty" -Flag des Steuerelements mit dem "onlySelf: true" -Parameter gesetzt. 
Dadurch wird das FormControl als bearbeitet markiert, damit die Validierung durchgeführt werden kann.
Wenn es sich um ein FormGroup handelt, 
wird die Methode rekursiv aufgerufen, um alle untergeordneten Formularelemente zu validieren.
Dadurch werden alle Formularfelder innerhalb des FormGroup-Objekts als bearbeitet markiert, 
was dazu führt, dass die erforderlichen Validierungen ausgeführt werden, um sicherzustellen, 
dass alle Eingaben gültig sind.
*/