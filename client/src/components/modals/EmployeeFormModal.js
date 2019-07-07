import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
} from "rimble-ui";
import ModalCard from './ModalCard';
import EmployeeForm from "../forms/EmployeeForm";

class EmployeeFormModal extends React.Component {
  state = {
    processing: false,
  };

  getZalarifyCompanyContract = () => {
    const { contracts, web3, companyAddress } = this.props;
    const currentContractData = contracts.find(contract => contract.name === 'IZalarifyCompany');
    const contract = currentContractData.abi;
    const instance = new web3.eth.Contract(
        contract.abi,
        companyAddress
    );
    return instance;
  }

  setProcessing = () => {
    this.setState({
      processing: true,
    });
  }

  setNotProcessing = () => {
    this.setState({
      processing: false,
    });
  }

  toast = (component, isError = false) => {
    if (isError) {
      this.setNotProcessing();
      toast.error(component, {
        hideProgressBar: false,
      });
    } else {
      toast.info(component, {
        hideProgressBar: false,
      });
    }
  }

  invokeContract = (item) => {
    const { web3, info } = this.props;
    const { utils } = web3;
    let result;

    try {
      const zalarifyCompany = this.getZalarifyCompanyContract();
      this.setProcessing();
      result = zalarifyCompany.methods.addEmployee(
        item.wallet,
        item.employeeType,
        utils.fromAscii(item.name).padEnd(66, '0'),
        utils.fromAscii(item.role).padEnd(66, '0'),
        utils.fromAscii(item.email).padEnd(66, '0'),
        item.preferedTokenPayment.address,
        item.salaryAmount
      ).send({from: info.selectedAddress});
    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
    return result;
  }

  handleSubmit = async (item) => {
    const { config, employeeCreatedCallback } = this.props;

    const result = this.invokeContract(item);
    result.on('transactionHash', (hash) => {
        this.toast(<div>
          <a href={`${config.explorer.tx}${hash}`} target="_blank">Processing Transaction</a>
        </div>);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.toast(<div>
          Success <a href={`${config.explorer.tx}${receipt.tx}`} target="_blank">Transaction</a>
        </div>);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber < 2) {
          this.toast(<div>
            {`Confirmation #${confirmationNumber}`} <a href={`${config.explorer.tx}${receipt.tx}`} target="_blank">View Transaction</a>
          </div>);
        } else {
          if (confirmationNumber === 2) {
            this.setNotProcessing();
            employeeCreatedCallback(item, receipt);
            result.removeAllListeners();
          }
        }
      })
      .on('error', (error) => {
        this.toast(<div>
          {`Message: ${error.message}`}
        </div>, true);
      });

  };

  renderContent = () => {
    const {currentCompany} = this.props;
    return (
      <React.Fragment>
        <Box mb={3}>
          <Heading.h2>Employee Form - {currentCompany ? currentCompany.name : ''}</Heading.h2>
          <Text my={3} textAlign={"center"}>
            It allows you to create or edit a employee.
          </Text>
        </Box> 
        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          <EmployeeForm
            width={1}
            config={this.props.config}
            companies={this.props.companies}
            handleSubmit={this.handleSubmit}
            currentCompany={this.props.currentCompany}
            processing={this.state.processing}
            {...this.props}
          />
        </Flex>
      </React.Fragment>
    );
  }
  
  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalCard closeFunc={this.props.closeModal}>
            <React.Fragment>
              <ModalCard.Body>
                {this.renderContent()}
              </ModalCard.Body>
            </React.Fragment>
        </ModalCard>
        <div>
          <ToastContainer
            position="bottom-right"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        </div>
      </Modal>
    );
  }
}

export default EmployeeFormModal;